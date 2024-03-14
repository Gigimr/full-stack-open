Cypress.config('pageLoadTimeout', 1000);
describe('Blog App' , function () {
  const user = {
    name: 'Miguel',
    username: 'test1',
    password: 'test1234'
  };

  const user2= {
    name: 'Yuco',
    username: 'yuco20' ,
    password: 'test1234'
  };

  before(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST','http://localhost:3003/api/users', user);
    cy.request('POST','http://localhost:3003/api/users', user2);

  });

  const login = function (user) {
    cy.contains('Log in to application');
    cy.get('input:first').type(user.username);
    cy.get('input:last').type(user.password);
    cy.contains('login').click();
    cy.contains(`${user.name} logged in`);
  };

  beforeEach( function () {
    cy.wait(3000);
    cy.visit('http://localhost:5173');

  });

  it('Login form is shown', function() {
    cy.contains('Log in to application');
  });
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      login(user);
      cy.contains('new blog');
    });

    it('fails with wrong credentials', function() {
      cy.contains('Log in to application');
      cy.get('input:first').type('test1');
      cy.get('input:last').type('test');
      cy.contains('login').click();
      cy.contains('wrong username or password');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      login(user);
    });
    it('A blog can be created', function() {
      cy.contains('new blog').click();
      cy.get('#title').type('React Native');
      cy.get('#author').type('Ramarj');
      cy.get('#url').type('react.com');
      cy.get('#createButton').click();
      cy.contains('React Native - Ramarj');
    });

    it('user can like a blog', function () {
      cy.contains('view').click();
      cy.contains('0');
      cy.contains('like').click();
      cy.contains('1');
    });

    it('user who created a blog can delete it', function () {
      cy.contains('React Native - Ramarj');
      cy.contains('view').click();
      cy.get('#removeButton').click();
      cy.contains('remove').should('not.exist');
    });
  });

  describe('When there are two users', function () {
    beforeEach(function () {
      login(user2);

    });
    it('only user who created the blog can delete it', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('Node Js');
      cy.get('#author').type('Tamuaf');
      cy.get('#url').type('node.com');
      cy.get('#createButton').click();
      cy.contains('Node Js - Tamuaf');
      cy.contains('logout').click();

      login(user);
      cy.contains('view').click();

      cy.contains('remove').should('not.exist');
    });

    it.only('blogs are ordered by likes', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('Blog with most likes');
      cy.get('#author').type('gigi');
      cy.get('#url').type('gigi.com');
      cy.get('#createButton').click();

      cy.contains('new blog').click();
      cy.get('#title').type('Blog with less likes');
      cy.get('#author').type('anaa');
      cy.get('#url').type('ana.com');
      cy.get('#createButton').click();

      cy.contains('Blog with most likes - gigi').contains('view').click();
      cy.get('button').contains('like').click();

      cy.get('.blog').eq(0).should('contain','Blog with most likes - gigi' );
      cy.get('.blog').eq(1).should('contain','Blog with less likes - anaa' );
    });


  });

  // it('frontpage can be opened',async  function () {
  //   cy.wait(3000)
  //   cy.contains('Blogs');
  // });
});