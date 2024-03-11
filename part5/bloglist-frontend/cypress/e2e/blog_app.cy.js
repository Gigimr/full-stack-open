describe('Blog app', function() {
  it('front page can be opened', function() { 
    cy.visit('http://localhost:5173');
    cy.contains('Log in to application');
    // cy.contains('Blog app, Department of Computer Science, University of Helsinki 2024')
  });
});