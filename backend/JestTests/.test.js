
const request = require("supertest");
const { app } = require("../userloginapp/app");

const db = require("../userloginapp/models");
//open connection with db
beforeAll((done) => {

  server = app.listen(4000, (err) => {
    if (err) return done(err);

     agent = request.agent(server); // since the application is already listening, it should use the allocated port
     done();
  });
});
// TESTS START

//POST
describe('AUTH Endpoints', () => {
  it('Log in with good credentials', async () => {
    const res = await agent
      .post('/api/auth/signin')
      .send({
        username: "blabla",
        password: "admin",
      })         
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty("id");
   expect(res.body.username).toEqual("blabla")
   expect(res.body).toHaveProperty("email")
   expect(res.body).toHaveProperty("roles")
   expect(res.body).toHaveProperty("accessToken")

  })
  it('Fail log in due to wrong password', async () => {
    const res = await agent
      .post('/api/auth/signin')
      .send({
        username: "admin", 
        password: "sdkfjfkf",
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body.message).toEqual("Invalid Password!");

  })
  it('Fail log in due to wrong username', async () => {
    const res = await agent
      .post('/api/auth/signin')
      .send({
        username: "admin111", 
        password: "sdkfsjf",
      })
    expect(res.statusCode).toEqual(404)
    expect(res.body.message).toEqual("User Not found.");

  })
  it('Signup invalid user', async () => {
    const res = await agent
      .post('/api/auth/signup')
      .send({
      })
    expect(res.statusCode).toEqual(500)

  })
  it('Signup invalid role', async () => {
    const res = await agent
      .post('/api/auth/signup')
      .send({
        username: "jestergsdfttest", 
        password: "jgdfghj",
        email: "test@gsdfjest.com",
        roles: ["usedasr"]
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("Failed! Role usedasr does not exist!");

  })
  it('Signup already registered name', async () => {
    const res = await agent
      .post('/api/auth/signup')
      .send({
        username: "rares", 
        password: "dfgjkdhfgj",
        email: "test@jest.com",
        roles: ["user"]
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("Failed! Username is already in use!");

  })
  it('Signup already registered email', async () => {
    const res = await agent
      .post('/api/auth/signup')
      .send({
        username: "testdasfontys", 
        password: "123123",
        email: "r.petrisor@student.fontys.nl",
        roles: ["user"]
      })
    expect(res.statusCode).toEqual(400)
    expect(res.body.message).toEqual("Failed! Email is already in use!");

  })
})

//TESTS END
//close connection to db
afterAll((done) => {
  db.mongoose.disconnect();
  return  server && server.close(done);
});
