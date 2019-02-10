
import {dbConnect} from "../src/util/db_connect";


describe('Setup', () => {
  it('#db setup', async function () {
    this.timeout(100000);
    await dbConnect()
  })
});
