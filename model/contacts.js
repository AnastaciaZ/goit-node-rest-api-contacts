const Contacts = require('./schemas/contactSchema')
/* const db = require('./db')
const {ObjectId}=require('mongodb')

const getCollection = async (db, name) => {
  const client = await db
  const collection = await client.db().collection(name)
  return collection
} */

const listContacts = async () => {
  const results = await Contacts.find()
  return results
}

/* const listContacts = async () => {
  const collection = await getCollection(db, 'contacts')
  const results = await collection.find().toArray()
  return results
} */

const getContactById = async (contactId) => {
  const result = await Contacts.findOne({ _id: contactId })
  return result
}

/* const getContactById = async (contactId) => {
  const collection = await getCollection(db, 'contacts')
  const objectId = new ObjectId(contactId)
  console.log(objectId.getTimestamp())
  const [result] = await collection.find({ _id: objectId }).toArray()
  return result
} */

const removeContact = async (contactId) => {
  const result = await Contacts.findByIdAndRemove({_id: contactId})
  return result
}

/* const removeContact = async (contactId) => {
  const collection = await getCollection(db, 'contacts')
  const objectId = new ObjectId(contactId)
  const { value: result } = await collection.findOneAndDelete({_id: objectId})
  return result
} */

const addContact = async (body) => {
  const result = await Contacts.create(body)
  return result
}

/* const addContact = async (body) => {
  const record = {
   // id,
    ...body
  }
  const collection = await getCollection(db, 'contacts')
  const { ops: [result],
  } = await collection.insertOne(record)
  return result
} */

const updateContact = async (contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: contactId },
    { ...body },
    {new: true},
  )
  return result
}

/* const updateContact = async (contactId, body) => {
  const collection = await getCollection(db, 'contacts')
  const objectId = new ObjectId(contactId)
  const { value: result } = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: body },
    {returnOriginal: false},
  )
  return result
} */

const updateStatusContact = async (contactId, body) => {
  const result = await Contacts.findByIdAndUpdate(
    { _id: contactId },
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
