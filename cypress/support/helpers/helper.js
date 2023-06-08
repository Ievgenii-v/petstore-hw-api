export function compareResponseAndRequestBody(response, requestObject) {
	expect(response.status).to.be.equal(200);
	expect(response.body).to.be.eql(requestObject);
}
export function getAndVerifyPetById(id, requestObject) {
	cy.request('GET', `/pet/${id}`).then((response) => {
		compareResponseAndRequestBody(response, requestObject);
	});
}
