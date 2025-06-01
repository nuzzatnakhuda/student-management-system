const { faker } = require('@faker-js/faker');
const router = require('express').Router()

router.get('/randomStudent',(req,res)=>{
     res.status(200).send({
        first_name: faker.name.firstName(),
        father_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        date_of_birth: faker.date.past(15, new Date('2007-01-01')).toISOString().split('T')[0], // Date between 2007 and 2022
        gender: faker.helpers.arrayElement(['M', 'F']),
        address: faker.address.streetAddress(),
        contact_number: faker.phone.number('#####-#####'),  // Format for phone number
        email: faker.internet.email(),
        religion: faker.helpers.arrayElement(['Christianity', 'Islam', 'Hinduism', 'Buddhism', 'Other']),
        caste: faker.helpers.arrayElement(['General', 'OBC', 'SC', 'ST', 'Other']),
        place_of_birth: faker.address.city(),
        father_occupation: faker.helpers.arrayElement(['Business', 'Farmer', 'Teacher', 'Engineer', 'Doctor']),
        occupation_address: faker.address.streetAddress(),
    });
})


module.exports = router