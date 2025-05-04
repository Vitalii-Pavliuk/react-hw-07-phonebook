import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetContactsQuery, useAddContactMutation, useDeleteContactMutation} from "./redux/contactsApi";
import { setFilter } from "./redux/filtersSlice";

import ContactForm from "./ContactForm/ContactForm";
import ContactList from "./ContactList/ContactList";
import SearchContact from "./SearchContact/SearchContact";

import style from "./App.module.css";

function App() {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.filters.filter);

  const { data: contacts = [], isLoading, isError } = useGetContactsQuery();
  const [addContact] = useAddContactMutation();
  const [deleteContact] = useDeleteContactMutation();

  const handleAddContact = async (name, phone) => {
    if (!name || !phone) return;
    const exists = contacts.some(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      alert(`${name} is already in contacts.`);
      return;
    }
    await addContact({ name, phone });
  };

  const handleDeleteContact = async (id) => {
    await deleteContact(id);
  };

  const handleFilterChange = (e) => {
    dispatch(setFilter(e.target.value));
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={style.container}>
      <h1 className={style.title}>Phonebook</h1>
      <ContactForm onAddContact={handleAddContact} />
      <h2 className={style.subtitle}>Contacts</h2>
      <SearchContact value={filter} onFilterChange={handleFilterChange} />
      {isLoading && <p>Loading contacts...</p>}
      {isError && <p>Error fetching contacts.</p>}
      {!isLoading && (
        <ContactList contacts={filteredContacts} onDelete={handleDeleteContact} />
      )}
    </div>
  );
}

export default App;