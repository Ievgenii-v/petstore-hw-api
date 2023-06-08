import pet from '../fixtures/pet.json';
import { faker } from '@faker-js/faker';
import {
	compareResponseAndRequestBody,
	getAndVerifyPetById,
} from '../support/helpers/helper.js';
pet.id = faker.number.int();
pet.name = faker.animal.cat.name;
pet.category.id = faker.number.int(3);
pet.category.name = faker.animal.type();

it('Create pet', () => {
	cy.request('POST', '/pet', pet).then((response) => {
		cy.log(`Request body: ${response.requestBody}`);
		compareResponseAndRequestBody(response, pet);
	});
});

it('Get pet by id', () => {
	cy.log(`Get pet with id: ${pet.id}`);

	cy.request('GET', `/pet/${pet.id}`).then((response) => {
		compareResponseAndRequestBody(response, pet);
	});
});

it('Update pet', () => {
	cy.log(`Update pet with id: ${pet.id}`);

	pet.name = 'AnimalAfterUpdate';
	pet.status = 'sold';
	cy.request('PUT', '/pet', pet).then((response) => {
		compareResponseAndRequestBody(response, pet);
	});

	getAndVerifyPetById(pet.id, pet);
});

it('Find pet by status', () => {
	cy.log(`Find pet with id: ${pet.id}`);

	cy.request('GET', `/pet/findByStatus?status=${pet.status}`).then(
		(response) => {
			expect(response.status).to.be.equal(200);

			let pets = response.body;
			let resultPetArray = pets.filter((myPet) => {
				return myPet.id === pet.id;
			});

			expect(resultPetArray[0]).to.be.eql(pet);
		}
	);
});

it('Update pet with form data', () => {
	cy.log(`Find pet with id: ${pet.id}`);
	pet.name = 'AnimalAfterUpdateFormData';
	pet.status = 'pending';

	cy.request({
		method: 'POST',
		url: `/pet/${pet.id}`,
		form: true,
		body: { name: pet.name, status: pet.status },
	}).then((response) => {
		expect(response.status).to.be.equal(200);
		parseInt(response.body.message);
	});

	getAndVerifyPetById(pet.id, pet);
});

it('Delete pet', () => {
	cy.log(`Update pet with id: ${pet.id}`);

	cy.request('DELETE', `/pet/${pet.id}`, pet).then((response) => {
		expect(response.status).to.be.equal(200);
		expect(parseInt(response.body.message)).to.be.equal(pet.id);
	});

	cy.request({
		method: 'GET',
		url: `/pet/${pet.id}`,
		failOnStatusCode: false,
	}).then((response) => {
		expect(response.status).to.be.equal(404);
		expect(response.body.message).to.be.equal('Pet not found');
		expect(response.body.type).to.be.equal('error');
	});
});
