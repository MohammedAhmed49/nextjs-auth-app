import { useRef } from "react";
import classes from "./profile-form.module.css";

function ProfileForm(props) {
  const newPassRef = useRef();
  const oldPassRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();

    props.changePassword({
      oldPassword: oldPassRef.current.value,
      newPassword: newPassRef.current.value,
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPassRef} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPassRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
