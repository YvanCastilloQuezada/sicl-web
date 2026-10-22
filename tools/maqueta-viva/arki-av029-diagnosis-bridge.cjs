"use strict";

const {diagnose} = require("./arki-av028-self-diagnosis.cjs");

function publicDiagnosis(root) {
  const source = diagnose(root);

  return {
    schema: "ARKI-AV029-DIAGNOSIS-1",
    head: source.head,
    summary: source.summary,
    checks: source.checks,
    unknowns: source.unknowns,
    proposals: source.proposals.map(p => ({
      id: p.id,
      sourceCheck: p.sourceCheck,
      status: p.status,
      executionAuthorized: false
    })),
    policy: {
      execution: "READ_ONLY",
      canonicalWrite: false,
      automaticRepair: false,
      poApproval: "REQUIRED"
    },
    receiptSha256: source.receiptSha256
  };
}

const script = String.raw`<script id="arki-av029-bridge">
(function(){
  "use strict";

  const targetId = "arki-av029-diagnosis";

  function install(){
    if(document.getElementById(targetId))return;

    const host =
      document.getElementById("arki-av023-evidence");

    if(!host)return;

    const panel=document.createElement("section");
    panel.id=targetId;
    panel.setAttribute("aria-label","Autodiagnóstico ARKI");
    panel.style.cssText=
      "border-top:1px solid #55758a;margin-top:10px;padding-top:10px";

    const title=document.createElement("strong");
    title.textContent="ARKI · Autodiagnóstico";
    panel.append(title);

    const status=document.createElement("p");
    status.setAttribute("role","status");
    panel.append(status);

    const details=document.createElement("div");
    panel.append(details);

    host.append(panel);

    async function refresh(){
      try{
        const response=await fetch("/api/diagnosis",{
          cache:"no-store"
        });

        if(!response.ok)throw Error("HTTP "+response.status);

        const data=await response.json();

        if(
          data.schema!=="ARKI-AV029-DIAGNOSIS-1" ||
          data.policy?.canonicalWrite!==false ||
          data.policy?.automaticRepair!==false
        )throw Error("INVALID_DIAGNOSIS");

        const s=data.summary;

        status.textContent=
          "PASS "+s.passed+
          " · FAIL "+s.failed+
          " · UNKNOWN "+s.unknown;

        details.replaceChildren();

        for(const item of [
          ...data.checks.filter(x=>x.status==="FAIL"),
          ...data.unknowns
        ]){
          const line=document.createElement("p");
          line.textContent=
            item.status+" · "+item.id;
          details.append(line);
        }

        const note=document.createElement("small");
        note.textContent=
          "Solo lectura · Sin ejecución ni autorización automática";
        details.append(note);

      }catch(error){
        status.textContent=
          "Diagnóstico no disponible: "+error.message;
        details.replaceChildren();
      }
    }

    refresh();
    const timer=setInterval(()=>{
      if(!document.hidden)refresh();
    },30000);

    window.addEventListener("pagehide",
      ()=>clearInterval(timer),{once:true});
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",install,{once:true});
  }else{
    install();
  }
})();
</script>`;

module.exports={publicDiagnosis,script};
