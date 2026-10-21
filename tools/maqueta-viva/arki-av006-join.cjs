"use strict";
/** Explicit join of two already-produced receipts; never executes tests. */
const fs=require("node:fs");
const {assess}=require("./arki-av006-diagnostic.cjs");
function read(file){const st=fs.lstatSync(file);if(!st.isFile()||st.isSymbolicLink()||st.size>3000000)throw Error("UNSAFE_REPORT");return JSON.parse(fs.readFileSync(file,"utf8"))}
if(require.main===module){try{if(process.argv.length!==4)throw Error("USAGE: node arki-av006-join.cjs LIVE_CYCLE_JSON SELF_TEST_JSON");process.stdout.write(JSON.stringify(assess(read(process.argv[2]),read(process.argv[3])),null,2)+"\n")}catch(e){process.stderr.write("ARKI_AV006_FAIL: "+e.message+"\n");process.exitCode=1}}
