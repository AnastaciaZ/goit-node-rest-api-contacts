const Contacts = require('./schemas/contactSchema')

const listContacts = async (userId, query) => {
  const results = await Contacts.find({owner: userId})
  return results
}

const getContactById = async (userId, contactId) => {
  const result = await Contacts.findOne({ _id: contactId, owner: userId })
  return result
}

const removeContact = async (userId, contactId) => {
  const result = await Contacts.findByIdAndRemove({_id: contactId, owner: userId})
  return result
}

const addContact = async (userId, body) => {
  const result = await Contacts.create({ ...body,  owner: userId})
  return result
}

const updateContact = async (userId, contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    {new: true},
  )
  return result
}

const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    {new: true},
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
