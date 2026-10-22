import { describe, expect, it } from "vitest";
import { createAuthorizedStorage } from "./arkiAuthorizedStorage.mjs";

function fixture() {
  const objects = new Map<string, any>();
  const files = new Map<string, Buffer>();
  let projectOwned = true;
  let duringRead: (key: string) => Promise<void> = async () => {};

  const ledger = {
    async isProjectOwner(ownerId: number, projectId: string) {
      return projectOwned && ownerId === 1 && projectId === "alpha";
    },
    async insertPending(record: any) {
      objects.set(record.objectId, { ...record, status: "PENDING" });
    },
    async transitionReady(
      objectId: string,
      ownerId: number,
      projectId: string
    ) {
      const record = objects.get(objectId);
      if (
        !record ||
        record.status !== "PENDING" ||
        record.ownerId !== ownerId ||
        record.projectId !== projectId
      ) {
        throw new Error("INVALID_TRANSITION");
      }
      record.status = "READY";
    },
    async revoke(objectId: string, ownerId: number, projectId: string) {
      const record = objects.get(objectId);
      if (
        record &&
        record.ownerId === ownerId &&
        record.projectId === projectId
      ) {
        record.status = "REVOKED";
      }
    },
    async get(objectId: string) {
      const record = objects.get(objectId);
      return record ? { ...record } : undefined;
    },
    mutateForTest(objectId: string, patch: Record<string, unknown>) {
      const record = objects.get(objectId);
      if (!record) throw new Error("TEST_RECORD_NOT_FOUND");
      Object.assign(record, patch);
    },
  };

  const filesBackend = {
    async putExact(key: string, data: Buffer) {
      files.set(key, Buffer.from(data));
    },
    async readExact(key: string) {
      const data = files.get(key);
      await duringRead(key);
      return data === undefined ? undefined : Buffer.from(data);
    },
    async deleteExact(key: string) {
      files.delete(key);
    },
  };

  return {
    service: createAuthorizedStorage({ ledger, files: filesBackend }),
    ledger,
    files,
    setProjectOwned(value: boolean) {
      projectOwned = value;
    },
    setDuringRead(fn: (key: string) => Promise<void>) {
      duringRead = fn;
    },
  };
}

async function putSample(f: ReturnType<typeof fixture>) {
  return f.service.put({
    ownerId: 1,
    projectId: "alpha",
    data: Buffer.from("contenido valido"),
    contentType: "text/plain",
  });
}

describe("ARKI authorized storage", () => {
  it("lectura autorizada devuelve el contenido y su tipo", async () => {
    const f = fixture();
    const saved = await putSample(f);

    const result = await f.service.read({
      ownerId: 1,
      projectId: "alpha",
      objectId: saved.objectId,
    });

    expect(result.body.toString()).toBe("contenido valido");
    expect(result.contentType).toBe("text/plain");
  });

  it("deniega si se pierde la propiedad del proyecto durante la lectura", async () => {
    const f = fixture();
    const saved = await putSample(f);
    f.setDuringRead(async () => f.setProjectOwned(false));

    await expect(
      f.service.read({
        ownerId: 1,
        projectId: "alpha",
        objectId: saved.objectId,
      })
    ).rejects.toThrow("STORAGE_ACCESS_DENIED");
  });

  it("deniega si el objeto se revoca durante la lectura", async () => {
    const f = fixture();
    const saved = await putSample(f);

    f.setDuringRead(async () => {
      await f.ledger.revoke(saved.objectId, 1, "alpha");
    });

    await expect(
      f.service.read({
        ownerId: 1,
        projectId: "alpha",
        objectId: saved.objectId,
      })
    ).rejects.toThrow("STORAGE_ACCESS_DENIED");
  });

  it("deniega si cambia el propietario del registro durante la lectura", async () => {
    const f = fixture();
    const saved = await putSample(f);
    f.setDuringRead(async () => {
      f.ledger.mutateForTest(saved.objectId, { ownerId: 2 });
    });
    await expect(f.service.read({
      ownerId: 1, projectId: "alpha", objectId: saved.objectId,
    })).rejects.toThrow("STORAGE_ACCESS_DENIED");
  });

  it("deniega si cambia el proyecto del registro durante la lectura", async () => {
    const f = fixture();
    const saved = await putSample(f);
    f.setDuringRead(async () => {
      f.ledger.mutateForTest(saved.objectId, { projectId: "other" });
    });
    await expect(f.service.read({
      ownerId: 1, projectId: "alpha", objectId: saved.objectId,
    })).rejects.toThrow("STORAGE_ACCESS_DENIED");
  });

  it("deniega si el estado deja de ser READY durante la lectura", async () => {
    const f = fixture();
    const saved = await putSample(f);
    f.setDuringRead(async () => {
      f.ledger.mutateForTest(saved.objectId, { status: "REVOKED" });
    });
    await expect(f.service.read({
      ownerId: 1, projectId: "alpha", objectId: saved.objectId,
    })).rejects.toThrow("STORAGE_ACCESS_DENIED");
  });

  it("deniega si cambia la clave del registro durante la lectura", async () => {
    const f = fixture();
    const saved = await putSample(f);
    f.setDuringRead(async () => {
      f.ledger.mutateForTest(saved.objectId, { key: "objects/otro-objeto" });
    });
    await expect(f.service.read({
      ownerId: 1, projectId: "alpha", objectId: saved.objectId,
    })).rejects.toThrow("STORAGE_ACCESS_DENIED");
  });

  it("rechaza contenido alterado mediante la comprobación de integridad", async () => {
    const f = fixture();
    const saved = await putSample(f);
    f.files.set(`objects/${saved.objectId}`, Buffer.from("contenido alterado"));

    await expect(
      f.service.read({
        ownerId: 1,
        projectId: "alpha",
        objectId: saved.objectId,
      })
    ).rejects.toThrow("STORAGE_INTEGRITY_FAILURE");
  });
});
