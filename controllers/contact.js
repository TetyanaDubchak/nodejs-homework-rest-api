const Contact = require('../models/contact');

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find().exec();
    console.log(contacts);
    res.json(contacts);
  } catch (error) {
    next(error); 
  }
}

async function getContactById(req, res, next) {
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
}

async function addContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite
  }
 
  try {
    const answer = await Contact.create(contact);
    console.log(answer);
    res.json(answer);
  }catch (error) {
    next(error);
  }
}

async function removeContact(req, res, next) {
  const { contactId } = req.params;

  try {
    const answer = await Contact.findByIdAndDelete(contactId);

    if (answer === null) {
      return res.status(404).json('Contact not found')
    }
    res.json(answer)
  }catch (error) {
      next(error);
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;

  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite
  };

  try {
    const answer = await Contact.findByIdAndUpdate(contactId, contact);

    if (answer === null) {
      return res.status(404).json('Contact not found')
    } 
    
    res.json(answer)
  }catch (error) {
      next(error);
  }
}

async function updateStatusContact (req, res, next) {
  const { contactId } = req.params;
  const { favorite = false} = req.body;

    if (favorite === null) {
    return res.status(400).json('Missing field favorite');
  }

  try {
    const answer = await Contact.findByIdAndUpdate(contactId, {favorite});

    if (answer) {
      return res.status(200).json(answer);
    } else {
      return next()
    }

  }catch (error) {
      next(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}