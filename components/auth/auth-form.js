import { useEffect, useRef, useState } from "react";
import classes from "./auth-form.module.css";
import { createUser } from "./auth-util";
import { getSession, signIn } from "next-auth/client";
import { useRouter } from "next/router";

function AuthForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();

  const emailRef = useRef();
  const passRef = useRef();

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push("/profile");
      } else {
        setIsLoading(false);
      }
    });
  }, []);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passRef.current.value;
    if (isLogin) {
      const auth = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (auth.error) {
        alert(auth.error);
      } else {
        router.push("/profile");
      }
    } else {
      try {
        const res = await createUser(email, password);
        console.log(res);
      } catch (error) {
        alert(error);
      }
    }
  };

  if (isLoading) {
    return <p className={classes.auth}>Loading ...</p>;
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
