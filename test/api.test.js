const assert = require("assert");
const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

const ApiHost= "http://127.0.0.1:4396";
const ApiPoint = ApiHost+ "/api/v1";

const LocalConfig = dotenv.config({ path: path.join(__dirname, "../.env") });
const adminToken = LocalConfig.parsed.APP_SECRET;

const moduleApi = `${ApiPoint}/modules`;
const packageHostApi = `${ApiPoint}/package_hosts`;
const tokenApi = `${ApiHost}/token`

describe("0. Common API Test", function(){
  it("get token with module id", async () => {
      const res = await getToken("12810f50-9089-11ec-b8d8-c30a6442a316")
      assert.equal(res.status, 200, res.statusText)
      moduleToken = res.data.token
  })
})

describe("1. Package Host API Test", function(){
  let hosts = []
  let host = null
  describe("#GET /package_hosts", function () {
    it(`get host ok`, async () => {
      const res = await axios.default.get(
        packageHostApi);
      assert.equal(res.data?.code, 200, res.data.msg);
      hosts = res.data.data
    });

    after(async function(){
      for (const host of hosts) {
        await deleteHost(host.id)
      }
    })
  });
  
  describe("#POST /package_hosts", () => {
    it(`add host ok`, async () => {
      const res = await addHost()
      assert.equal(res.data?.code, 200, res.data.msg);
      host = res.data.data
    });
  });

  describe("#PUT /package_hosts", () => {
    it(`update host ok`, async () => {
      const res = await updateHost(host.id)
      assert.equal(res.data?.code, 200, res.data.msg)
    });
  });

  describe("#DELETE /package_hosts", () => {
    it(`delete host ok`, async () => {
      const res = await deleteHost(host.id)
      assert.equal(res.data?.code, 204, res.data.msg);
      host = res.data.data
    });
  });
})

describe("2. Module API Test", function () {
  let moduleId = "null"
  let moduleToken = "null"

  let modules = []

  describe("#GET /modules", function () {
    it(`get module list ok`, async () => {
      const res = await axios.default.get(
        moduleApi);
      assert.equal(res.data?.code, 200, res.data.msg);
      modules = res.data.data
    });

    after(async function(){
      for (const module of modules) {
        await axios.default.delete(moduleApi+'/'+ module.id,
          {
            headers: {
              authorization: adminToken,
            },
          }
        )
      }
    })
  });

  describe("#POST /modules", () => {
    it(`add module err when no host selected`, async () => {
      const res = await addModule()
      assert.equal(res.data?.code, 400, res.data.msg);
    });

    it(`add module ok`, async () => {
      await addHost()
      const res = await addModule()
      assert.equal(res.data?.code, 200, res.data.msg);
      moduleId = res.data.data.id
    });

    after(async function(){
      const res = await getToken(moduleId)
      moduleToken = res.data.token
    })
  });

  describe("#PUT /modules", function () {
    it(`update ok`, async () => {
      const uploadItem = {
        desc : 'update desc',
        repository : 'update repo'
      }
      const url = `${moduleApi}/${moduleId}`;
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

  describe("#DELETE /modules", function () {
    let url = ''
    before(function(){
      url = `${moduleApi}/${moduleId}`
    })
    it(`user delete not allowed`, async () => {
      url = `${moduleApi}/${moduleId}`;
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

describe("3. Package API Test", function(){
  const moduleApi = `${ApiPoint}/modules`;
  let moduleId = 'null'
  let moduleToken = 'null'

  before(async function(){
    const res = await addModule()
    moduleId = res.data.data.id
    const tokenRes = await getToken(moduleId)
    moduleToken = tokenRes.data.token
  })

  describe("#POST /packages", function () {
    it(`add package ok`, async () => {
      const res = await addPackage(moduleId, moduleToken)
      assert.equal(res.data?.code, 200, res.data.msg);
    });
  });

  describe("#GET /packages", function () {
    it(`get package list ok`, async () => {
      const res = await getPackage(moduleId)
      assert.equal(res.data?.code, 200, res.data.msg);
    });
  });
})

async function updateHost(hostId){
  return axios.default.put(
    `${packageHostApi}/${hostId}`,
    {
      protocol: 'update protocol test',
      host:  'update host test',
      port: 9000,
      api: {
        upload: '/update upload test',
        package: '/update package test'
      }
    },
    {
      headers: {
        authorization: adminToken,
      },
    }
  )
}

async function addHost(method){
  method = method || 'post'
  return axios.default[method](
    packageHostApi,
    {
      protocol: (method === 'put' ? 'update' : 'add') + 'name test',
      host: (method === 'put' ? 'update' : 'add') + 'desc test',
      port: 8000,
      api: {
        upload: '/upload test' + (method === 'put' ? 'update' : 'add'),
        package: '/package test' + (method === 'put' ? 'update' : 'add')
      }
    },
    {
      headers: {
        authorization: adminToken,
      },
    }
  )
}

async function deleteHost(hostId){
  return axios.default.delete(packageHostApi+'/'+ hostId,
    {
      headers: {
        authorization: adminToken,
      },
    }
  )
}

async function addModule(){
  return axios.default.post(
    moduleApi,
    {
      name: 'name test',
      desc: 'desc test',
      type: 'type test',
      repository: 'repo test'
    },
    {
      headers: {
        authorization: adminToken,
      },
    }
  )
}

async function getToken(moduleId){
  return axios.default.put(
    tokenApi,
    {
        id: moduleId
    },
    {
      headers: {
        authorization: adminToken,
      },
    }
  )
}

async function addPackage(moduleId, moduleToken, method){
  method = method || 'post'
  return axios.default[method](
    `${moduleApi}/${moduleId}/packages`,
    {
      version: (method === 'put' ? 'update' : 'add') + 'version test',
      md5: 'a'.repeat(32),
      sha1: 'a'.repeat(40)
    },
    {
      headers: {
        authorization: moduleToken,
      },
    }
  )
}

async function getPackage(moduleId){
  return axios.default.get(`${moduleApi}/${moduleId}/packages`)
}