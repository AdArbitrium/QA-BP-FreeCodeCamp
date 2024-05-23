const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()

        //Note the keepOpen method just after the request method. 
        //Normally you would run your tests from the command line, 
        //or as part of an automated integration process, and you could 
        //let chai-http start and stop your server automatically.

        //However, the tests that run when this is submitted the link to this project 
        //require the server to be up, there is a need to use the keepOpen 
        //method to prevent chai-http from stopping the server.
        
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Guest');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=Alfred')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'hello Alfred');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          "surname" : "Colombo"
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.name, 'Cristoforo')
          assert.equal(res.body.surname, "Colombo")

          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai 
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send({
          "surname" : 'da Verrazzano'
        })
        .end(function (err,res){
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json')
          assert.equal(res.body.name, 'Giovanni')
          assert.equal(res.body.surname, 'da Verrazzano')
        })
      
      done();
    });
  });
});

const Browser = require('zombie');


//added project url
Browser.site = 'http://localhost:3000';


suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  const browser = new Browser();

  suiteSetup(function(done){
    return browser.visit('/', done());
  });


  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    suiteSetup(function(done){
      return browser.visit('/', done());
    });
    console.log('checkpoint 0')
    test('Submit the surname "Colombo" in the HTML form', function(done) {
      console.log('checkpoint 1')
      browser
        .fill('surname', 'Colombo')
        .pressButton('submit', () => {
          browser.assert.success();
          browser.assert.text('span#name', 'Cristoforo');
          browser.assert.text('span#surname', 'Colombo');
          browser.assert.elements('span#dates', 1);
 
          done();
        });
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {
      browser
      .fill('surname', 'Vespucci')
      .pressButton('submit', ()=>{
        browser.assert.success();
        browser.assert.text('span#name', 'Amerigo');
        browser.assert.text('span#surname', 'Vespucci');
        browser.assert.elements('span#dates', 1);
        done();
      })
      
    });
  });
});
