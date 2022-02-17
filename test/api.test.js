const assert = require("assert");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

const baseUrl = "http://127.0.0.1:4396";
const apiUrl = baseUrl + "/api/v1";

const LocalConfig = dotenv.config({ path: path.join(__dirname, "../.env") });
const adminToken = LocalConfig.parsed.APP_SECRET;

describe("Module API", function () {
  const api = `${apiUrl}/modules`;
  let moduleId = "null"
  let moduleToken = "null"

  let modules = []
  let moduleItem = {
      name: 'test',
      desc: 'desc test',
      type: 'test type',
      repository: 'repo test'
  }
  // get all module

  describe("#get all module", function () {
    it(`GET ${api}`, async () => {
      const res = await axios.default.get(
        api);
      assert.equal(res.data?.code, 200, res.data.msg);
      modules = res.data.data
    });

    after(async function(){
      for (const module of modules) {
        const res = await axios.default.delete(api+'/'+ module.id,
          {
            headers: {
              authorization: adminToken,
            },
          }
        )
      }
    })
  });

  describe("#admin add module", () => {
    it(`POST ${api}`, async () => {
      const res = await axios.default.post(
        api,
        moduleItem,
        {
          headers: {
            authorization: adminToken,
          },
        }
      );

      assert.equal(res.data?.code, 200, res.data.msg);
      moduleId = res.data.data.id
    });
  });

  describe("#admin fetch module token", () => {
    const url = `${baseUrl}/token`
    it(`PUT ${url}`, async () => {
      const res = await axios.default.put(
        url,
        {
            id: moduleId
        },
        {
          headers: {
            authorization: adminToken,
          },
        }
      );
      assert.equal(res.status, 200, res.statusText)
      moduleToken = res.data.token
    });
  });

  describe("#update module", function () {
    it(`update ok`, async () => {
      const uploadItem = {
        desc : 'update desc',
        repository : 'update repo'
      }
      const url = `${apiUrl}/modules/${moduleId}`;
      const res = await axios.default.put(
        url,
        uploadItem,
        {
          headers: {
            authorization: moduleToken,
          },
        }
      );
      assert.equal(res.data?.code, 200, res.data.msg);
    });
  });

  describe("#delete module", function () {
    let url = ''
    before(function(){
      url = `${api}/${moduleId}`
    })
    it(`user delete not allowed`, async () => {
      url = `${api}/${moduleId}`;
      const res = await axios.default.delete(
        url,
        {
          headers: {
            authorization: moduleToken,
          },
        }
      );
      assert.equal(res.data?.code, 403, res.data.msg);
    });
    it(`admin delete ok`, async () => {
      const res = await axios.default.delete(
        url,
        {
          headers: {
            authorization: adminToken,
          },
        }
      );
      assert.equal(res.data?.code, 204, res.data.msg);
    });
  });

});
