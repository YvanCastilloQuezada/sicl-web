"use strict";

const {
  fromRepository
}=require("./arki-av031-needs-engine.cjs");

function publicNeeds(root){
  const result=fromRepository(root);

  if(
    result.schema!=="ARKI-AV031-NEEDS-1" ||
    result.gates?.canonicalWrite!==false ||
    result.gates?.automaticRepair!==false ||
    result.gates?.dependencyPropagation!==false ||
    result.gates?.poApprovalRequired!==true ||
    result.gates?.readOnly!==true
  ){
    throw Error("INVALID_NEEDS_POLICY");
  }

  for(const n of result.needs){
    if(
      n.executionAuthorized!==false ||
      n.propagation!=="BLOCKED" ||
      n.promotion!=="BLOCKED" ||
      n.phaseMapping?.status!=="UNRESOLVED" ||
      n.dependencies?.unresolved!==true ||
      !Array.isArray(n.strategies) ||
      n.strategies.length!==3 ||
      n.strategies.some(s=>
        s.executionAuthorized!==false ||
        s.evidenceVerified!==false ||
        s.metricsVerified!==false ||
        s.canonicalWrite!==false
      )
    ){
      throw Error("UNSAFE_NEED");
    }
  }

  return {
    schema:"ARKI-AV032-PUBLIC-NEEDS-1",
    source:result.source,
    summary:result.summary,
    needs:result.needs.map(n=>({
      id:n.id,
      sourceId:n.sourceId,
      sourceType:n.sourceType,
      state:n.state,
      phaseMapping:n.phaseMapping,
      dependencies:n.dependencies,
      evidence:n.evidence,
      strategies:n.strategies,
      promotion:n.promotion,
      propagation:n.propagation,
      executionAuthorized:false,
      poApproval:"REQUIRED"
    })),
    gates:result.gates,
    receiptSha256:result.receiptSha256
  };
}

const script=String.raw`<script id="arki-av032-bridge">
(function(){
"use strict";

const targetId="arki-av032-needs";

function install(){
  if(document.getElementById(targetId))return;

  const host=document.getElementById(
    "arki-av023-evidence"
  );

  if(!host)return;

  const panel=document.createElement("section");
  panel.id=targetId;
  panel.setAttribute(
    "aria-label","Necesidades de investigación ARKI"
  );
  panel.style.cssText=
    "border-top:1px solid #55758a;" +
    "margin-top:10px;padding-top:10px";

  const title=document.createElement("strong");
  title.textContent="ARKI · Necesidades y estrategias";

  const status=document.createElement("p");
  status.setAttribute("role","status");

  const details=document.createElement("div");

  panel.append(title,status,details);
  host.append(panel);

  async function refresh(){
    try{
      const response=await fetch("/api/needs",{
        cache:"no-store"
      });

      if(!response.ok){
        throw Error("HTTP "+response.status);
      }

      const data=await response.json();

      if(
        data.schema!=="ARKI-AV032-PUBLIC-NEEDS-1" ||
        data.gates?.canonicalWrite!==false ||
        data.gates?.automaticRepair!==false ||
        data.gates?.dependencyPropagation!==false ||
        data.gates?.poApprovalRequired!==true ||
        !Array.isArray(data.needs)
      ){
        throw Error("INVALID_NEEDS_EVIDENCE");
      }

      if(data.summary?.total!==data.needs.length){
        throw Error("INVALID_NEEDS_COUNT");
      }

      const fragment=document.createDocumentFragment();

      for(const need of data.needs){
        if(
          need.executionAuthorized!==false ||
          need.propagation!=="BLOCKED" ||
          need.promotion!=="BLOCKED" ||
          need.phaseMapping?.status!=="UNRESOLVED" ||
          need.dependencies?.unresolved!==true ||
          !Array.isArray(need.strategies) ||
          need.strategies.length!==3 ||
          need.strategies.some(s=>
            s.executionAuthorized!==false ||
            s.evidenceVerified!==false ||
            s.metricsVerified!==false
          )
        ){
          throw Error("UNSAFE_NEED_DATA");
        }

        const article=document.createElement("article");
        article.style.cssText=
          "border:1px solid #55758a;" +
          "border-radius:6px;padding:8px;margin:8px 0";

        const heading=document.createElement("strong");
        heading.textContent=need.sourceId;

        const state=document.createElement("p");
        state.textContent=
          need.state+" · F1-F10 SIN ASIGNAR";

        article.append(heading,state);

        for(const strategy of need.strategies){
          const line=document.createElement("p");
          line.textContent=
            strategy.id+" · "+strategy.title+
            " · HIPOTESIS";
          article.append(line);
        }

        const gate=document.createElement("small");
        gate.textContent=
          "Dependencias no resueltas · " +
          "Propagación bloqueada · " +
          "Sin autorización de ejecución";

        article.append(gate);
        fragment.append(article);
      }

      const receipt=document.createElement("small");
      receipt.textContent=
        "Recibo: "+data.receiptSha256;

      fragment.append(receipt);

      details.replaceChildren(fragment);

      status.textContent=
        "Necesidades: "+data.summary.total+
        " · Estrategias: "+
        data.needs.reduce(
          (sum,n)=>sum+n.strategies.length,0
        )+
        " · Ejecutables: "+data.summary.executable;

    }catch(error){
      status.textContent=
        "Necesidades no disponibles: "+error.message;
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
  document.addEventListener(
    "DOMContentLoaded",install,{once:true}
  );
}else{
  install();
}
})();
</script>`;

module.exports={publicNeeds,script};
