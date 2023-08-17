import { useEffect, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Register(props: { 
    onSignin: () => void,
    onSuccess: () => void,
}) {
    const [error, setError] = useState("");
    const [inputs, setInputs] = useState({ username: "", password: "" });

    useEffect(() => {
      const checkUsername = setTimeout(() => {
        const { username } = inputs;

        fetch('http://localhost:3000/auth/checkUsername', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
        }).then(async function (response: Response) {
          const res = await response.json();
          if (response.ok && res['valid'] === false) {
            setError("Username Taken.")
          } else {
            setError("")
          }
        })
      }, 1000)

      return () => clearTimeout(checkUsername)
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (event: { target: { name: any; value: any; }; }) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log(inputs);
        fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputs),
        }).then(async function (response: Response) {
          const res = await response.json();
          if (response.ok) {
            props.onSuccess();
          } else if (res['statusCode'] === 417 && res['message'] === 'Username Taken') {
            setError("Username Taken.")
          }
        });
    }

    return (
        <>
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                  Username
                </label>
                {error !== '' &&
                <div className="relative leading-normal text-red-700" role="alert">
                  {error}
                </div>
                }
              </div>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={inputs.username || ""} 
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={inputs.password || ""} 
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member? 
            <a onClick={props.onSignin} className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> SignIn</a>
          </p>
        </div>
      </div>
    </>
    )
}

export default Register
