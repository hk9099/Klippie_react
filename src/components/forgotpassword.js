import React from 'react';

function Forgotpassword() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
            <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
                <div className="left_heading text-center">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Welcome to <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Klippie</span>&#128075;
                    </h1>
                    <p className="text-gray-600">
                        Klippie is a simple and easy to use password manager.
                    </p>
                </div>
                <div className="left_image">
                    <img src="" alt="background" />
                </div>
            </div>
            <div className="flex flex-col justify-center items-center right_block">
                <div className="right_heading text-center">
                    <h1 className="text-4xl font-bold text-gray-800">Forgot Password</h1>
                    <p className="text-gray-600">
                        Enter your email address to reset your password.
                    </p>
                </div>
                <div className="right_form">
                    <form>
                        <div className="form-group">
                            <label htmlFor="email" className="text-gray-600">
                                Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div className="form-group">
                            <button
                                type="submit"
                                className="btn btn-primary btn-block"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div>
                <div className="right_links">
                    <a href="/signup" className="text-gray-600">
                        Create an account
                    </a>
                    <a href="/" className="text-gray-600">
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Forgotpassword;
