import { TestSuiteRegister } from 'test-that';

// check how having to import all files manually can be avoided
import "./app/app.component.test";
import "./app/layout/header/header.component.test";

TestSuiteRegister.runAll();
