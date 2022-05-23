import './index.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [guestList, setGuestList] = useState([]);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const baseUrl = 'https://tranquil-retreat-79027.herokuapp.com/guests';

  useEffect(() => {
    async function getAllGuests() {
      try {
        const response = await fetch(baseUrl);
        const data = await response.json();
        console.log(data);
        setGuestList(data);
        setIsLoading(false);
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
      console.log(data);
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
      <div
        className="bg-blue-400 py-1em mt-2em rounded-[20px] tracking-wider text-white font-semibold ring-blue-500 ring-4 flex flex-col justify-center items-center"
        key={item.id}
      >
        <p className="leading-8 text-lg">{item.firstName}</p>
        <p className="text-lg">{item.lastName}</p>
        <div className="mt-1em py-1em border-t-2 w-[80%] text-center">
          <input
            id={item.id}
            type="checkbox"
            checked={item.attending}
            aria-label="attending"
            onChange={() => handleAttendance(item.id, item.attending)}
            className="inline-block mx-[.5em]"
          />
          <label htmlFor={item.id}>Attendance</label>
        </div>
        <button
          className="bg-slate-700 text-white font-semibold rounded-full mt-[.5em] px-[1.5em] py-[.5em]"
          aria-label="remove"
          onClick={() => handleDeleteGuest(item.id)}
        >
          Remove guest
        </button>
      </div>
    );
  });
  return (
    <div
      data-test-id="guest"
      className="flex flex-col w-[100%] justify-center items-center"
    >
      <form
        ref={formRef}
        className="bg-blue-400 py-2.5em px-4em font-semibold tracking-wider rounded-[55px] ring-blue-500 ring-4 text-center flex flex-col"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label className="text-white mb-[.5em]" htmlFor="firstName">
          First Name
        </label>
        <input
          id="firstName"
          value={firstNameInput}
          onChange={(e) => handleFirstNameInput(e)}
          className="mb-1em bg-stone-200 text-center text-slate-900 focus-within:outline-none rounded-full"
        />
        <label htmlFor="lastName" className="mb-[.5em] text-white">
          Last Name
        </label>
        <input
          id="lastName"
          value={lastNameInput}
          onChange={(e) => handleLastNameInput(e)}
          className="mb-1em bg-stone-200 text-center text-slate-900 focus-within:outline-none rounded-full"
        />
        <button className="bg-slate-700 text-white font-semibold rounded-full mt-[.5em] py-[.55em]">
          Add new guest
        </button>
      </form>
      <div
        className={
          isLoading
            ? 'flex flex-col justify-center items-center'
            : 'w-[90%] grid grid-cols-[repeat(4,23%)] gap-x-2em'
        }
      >
        {isLoading ? (
          <h1 className="font-bold text-3xl my-1em tracking-wide">
            Loading...
          </h1>
        ) : (
          guestListHtml
        )}
      </div>
    </div>
  );
}

export default App;
