import { useEffect, useState } from "react";
import Select from "react-select";
import "./Create.css";
import { useCollection } from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";
import { useAuthContext } from "../../hooks/useAuthContext";

const categories = [
  { value: "hobby", label: "Hobby" },
  { value: "fashion", label: "Fashion" },
  { value: "traveling", label: "Traveling" },
  { value: "work", label: "Work" },
];
const Create = () => {
  const { documents } = useCollection("users");
  // console.log(documents);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [checkError, setCheckError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (documents) {
      const options = documents.map((user) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCheckError(null);
    console.log(name, details, date, category.value, assignedUsers);

    if (!category || assignedUsers.length < 1) {
      setCheckError("Please correct inputs");
      return;
    }

    const project = {
      name: name,
      details,
      category: category.value,
      date: timestamp.fromDate(new Date(date)),
      comments: [],
      createdBy: {
        displayName: user.displayName,
        photoURL: user.photoURL,
        id: user.uid,
      },
      assignedUsersList: assignedUsers.map((u) => {
        return {
          displayName: u.value.displayName,
          photoURL: u.value.photoURL,
          id: u.value.id,
        };
      }),
    };

    console.log(project);
  };
  return (
    <div className="form">
      <h2 className="title">Create a new subject</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Subject name:</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></input>
        </label>
        <label>
          <span>Details:</span>
          <textarea
            required
            type="text"
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          ></input>
        </label>
        <label>
          <span>Category:</span>
          <Select onChange={(option) => setCategory(option)} options={categories} />
        </label>
        <label>
          <span>Assign to:</span>
          <Select onChange={(option) => setAssignedUsers(option)} options={users} isMulti />
        </label>
        <button className="btn">Add Subject</button>

        {checkError && <p className="error">{checkError}</p>}
      </form>
    </div>
  );
};

export default Create;
