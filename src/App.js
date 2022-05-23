import './index.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [guestList, setGuestList] = useState([]);
  const formRef = useRef(null);

  const baseUrl = 'http://localhost:4000/guests';

  useEffect(() => {
    async function getAllGuests() {
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        setGuestList(data);
      } catch (err) {
        console.log(err.message);
      }
    }

    getAllGuests().catch('');
  }, []);

  function handleFirstNameInput(e) {
    setFirstNameInput(e.currentTarget.value);
  }

  function handleLastNameInput(e) {
    setLastNameInput(e.currentTarget.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (e.key === 'Enter') {
      formRef.current.submit();
    }
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstNameInput,
          lastName: lastNameInput,
        }),
      });
      const data = await response.json();
      setGuestList((prevGuestList) => [data, ...prevGuestList]);
    } catch (error) {
      console.log(error.message);
    }
    setLastNameInput('');
    setFirstNameInput('');
  }

  async function handleAttendance(id, attendanceStatus) {
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attending: !attendanceStatus }),
      });
      const data = await response.json();
      setGuestList((prevState) =>
        prevState.map((oldGuest) =>
          oldGuest.id === data.id ? data : oldGuest,
        ),
      );
    } catch (err) {
      console.log(err.message);
    }
  }

  async function handleDeleteAllGuests() {
    try {
      await fetch(baseUrl, { method: 'DELETE' });
      setGuestList([]);
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleDeleteGuest(id) {
    fetch(`${baseUrl}/${id}`, {
      method: 'DELETE',
    })
      .then(
        setGuestList((prevGuestList) =>
          prevGuestList.filter((guest) => guest.id !== id),
        ),
      )
      .catch('');
  }

  const guestListHtml = guestList.map((item) => {
    return (
      <div className="guest" key={item.id}>
        <p>{item.first_name}</p>
        <p>{item.last_name}</p>
        <input
          id={item.id}
          type="checkbox"
          checked={item.attending}
          aria-label="attending"
          onChange={() => handleAttendance(item.id, item.attending)}
        />
        <label htmlFor={item.id}>Attendance</label>
        <button onClick={() => handleDeleteGuest(item.id)}>Delete guest</button>
      </div>
    );
  });
  return (
    <>
      <form ref={formRef} onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          value={firstNameInput}
          onChange={(e) => handleFirstNameInput(e)}
        />
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          value={lastNameInput}
          onChange={(e) => handleLastNameInput(e)}
        />
        <button>Add new guest</button>
      </form>
      {guestListHtml}
      <button onClick={handleDeleteAllGuests}>Delete all guests</button>
    </>
  );
}

export default App;
