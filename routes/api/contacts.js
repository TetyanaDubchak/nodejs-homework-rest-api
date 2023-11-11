const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();
require('../../db');

const Contact = require('../../models/contact');



// const Contacts = require('../../models/contacts');
// const contactsSchema = require('../../schemas/contacts');

const router = express.Router();
const jsonParser = express.json();

router.use(cors());
router.use(morgan('combined'));

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find().exec();

    res.json(contacts);
  } catch (error) {
    next(error); 
  }
})

// async function getContacts(req, res, next) {
//   try {
//     const contacts = await Contact.find().exec();

//     res.json(contacts);
//   } catch (error) {
//     next(error); 
//   }
// }

// async function getContactById (req, res, next) {
//   const { contactId } = req.params;
  
//   try {
//     const contact = await Contact.findById(contactId).exec();

//     if (contact === null) {
//       return res.status(404).json('Contact not found')
//     }

//     res.json(contact);
//   } catch (error) {
//     next(error); 
//   }
// }
 
router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await Contact.findById(contactId).exec();

    if (contact === null) {
      return res.status(404).json('Contact not found')
    }

    res.json(contact);
  } catch (error) {
    next(error); 
  }
})


// async function addContact(req, res, next) {
//   const contact = {
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//   }
 
//   try {
//     const answer = await Contact.create(contact);
//     res.json(answer);
//   }catch (error) {
//     next(error);
//   }
// }

router.post('/', jsonParser, async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  }
 
  try {
    const answer = await Contact.create(contact);
    res.json(answer);
  }catch (error) {
    next(error);
  }
  
})

// async function deleteContact(req, res, next) {
//   const { contactId } = req.params;

//   try {
//     const answer = await Contact.findByIdAndDelete(contactId);

//     if (answer === null) {
//       return res.status(404).json('Contact not found')
//     }

//   }catch (error) {
//       next(error);
//   }
// }

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;

  try {
    const answer = await Contact.findByIdAndDelete(contactId);

    if (answer === null) {
      return res.status(404).json('Contact not found')
    }

  }catch (error) {
      next(error);
  }
})
 

// async function updateContact(req, res, next) {
//   const { contactId } = req.params;

//   const contact = {
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//   };

//   try {
//     const answer = await Contact.findByIdAndUpdate(contactId, contact);

//     if (answer === null) {
//       return res.status(404).json('Contact not found')
//     }

//   }catch (error) {
//       next(error);
//   }
// }

router.put('/:contactId',jsonParser, async (req, res, next) => {
  const { contactId } = req.params;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const answer = await Contact.findByIdAndUpdate(contactId, contact);

    if (answer === null) {
      return res.status(404).json('Contact not found')
    }

  }catch (error) {
      next(error);
  }
})

router.use((_, res) => {
  res.status(404).json(" Not Found");
});

router.use((error, _, res, __) => {
  console.error(error);
  res.status(500).json("Internal Server Error");
});

module.exports = router
