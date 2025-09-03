describe('Phonebook', function() {
  it('frontpage can be seen', function() {
    cy.visit('http://localhost:3001')
    cy.contains('Numbers')
  })
})