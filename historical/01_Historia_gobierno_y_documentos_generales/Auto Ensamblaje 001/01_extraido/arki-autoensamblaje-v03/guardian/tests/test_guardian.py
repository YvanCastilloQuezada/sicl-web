import json
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from arki_guardian import db_open,inspect_registry,tick,decision,fetch_reference
class GuardianTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.db=db_open(Path(self.temp.name)/'state.db')
        self.goal={'statement':'Assemble','acceptance':['verified']}
        self.reg={'capabilities':[{'id':'A','phase':1,'dependencies':[],'epistemic':'VERIFIED','evidence':['x']},{'id':'B','phase':2,'dependencies':['A'],'epistemic':'UNKNOWN','evidence':[]}]}
    def tearDown(self): self.db.close();self.temp.cleanup()
    def test_dependencies(self):
        x=inspect_registry(self.reg);self.assertEqual(x['order'],['A','B']);self.assertTrue(x['capabilities'][0]['ready']);self.assertFalse(x['capabilities'][1]['ready'])
    def test_idempotent_proposals(self):
        a=tick(self.db,self.reg,self.goal);b=tick(self.db,self.reg,self.goal)
        self.assertEqual(len(a['new_proposals']),1);self.assertEqual(b['new_proposals'],[])
    def test_three_options_and_human_gate(self):
        pid=tick(self.db,self.reg,self.goal)['new_proposals'][0]
        data=json.loads(self.db.execute('SELECT payload FROM proposals WHERE id=?',(pid,)).fetchone()[0]);self.assertEqual(len(data['options']),3)
        with self.assertRaises(ValueError):decision(self.db,pid,'A','owner')
        result=decision(self.db,pid,'C','owner');self.assertEqual(result['execution'],'NOT_EXECUTED_REQUIRES_SEPARATE_GATE')
        with self.assertRaises(ValueError):decision(self.db,pid,'C','owner')
    def test_cycle(self):
        self.reg['capabilities'][0]['dependencies']=['B'];self.assertTrue(inspect_registry(self.reg)['cycles'])
    def test_invalid_phase(self):
        self.reg['capabilities'][0]['phase']=11
        with self.assertRaises(ValueError):inspect_registry(self.reg)
    def test_no_arbitrary_internet(self):
        for url in ['http://www.gob.pe','https://127.0.0.1/','https://evil.example/path','file:///etc/passwd']:
            with self.assertRaises(ValueError):fetch_reference(url)
    def test_goal_required(self):
        with self.assertRaises(ValueError):tick(self.db,self.reg,{})
if __name__=='__main__':unittest.main()
