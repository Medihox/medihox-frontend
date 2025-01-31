'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaKey, FaClinicMedical, FaImage } from 'react-icons/fa';

const dummyUser = {
  email: 'clinic@example.com',
  password: 'password123',
  verificationCode: '123456',
  secretKey: 'mysecretkey',
  clinicName: 'Healthy Smiles Clinic',
  clinicLogo: '',
};

export default function OnboardingLogin() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [clinicLogo, setClinicLogo] = useState<File | null>(null);
  const router = useRouter();

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const handleSubmit = () => router.push('/');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setClinicLogo(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-blue-50 to-teal-50">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gradient-to-r from-blue-600 to-teal-600 text-white p-8 lg:p-12 rounded-b-lg lg:rounded-r-lg shadow-lg">
        <h1 className="text-3xl lg:text-4xl font-bold text-center flex items-center">
          <FaClinicMedical className="mr-3" /> Welcome to ClinicPro
        </h1>
        <p className="mt-4 text-lg text-center">
          Streamline your clinic operations with our all-in-one practice management solution.
        </p>
        <div className="mt-8">
          <img
            src="https://netlinks.net//wp-content/uploads/2020/08/HMS-min.png" 
            alt="Clinic Illustration"
            className="w-64 h-64 object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-10">
        {/* Stepper */}
        <div className="flex justify-center w-full mb-8">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold ${
                    step >= num ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                >
                  {num}
                </div>
                {num !== 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > num ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Login */}
        {step === 1 && (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center flex items-center">
              <FaEnvelope className="mr-2" /> Clinic Login
            </h2>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleNext}
              className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              Next
            </button>
          </div>
        )}

        
        {/* Step 2: Verification Code */}
        {step === 2 && (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Enter Verification Code</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              We’ve sent a 6-digit code to your email. Please enter it below.
            </p>
            <div className="flex space-x-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={verificationCode[i] || ''}
                  onChange={(e) => {
                    const newCode = Array.from(verificationCode);
                    newCode[i] = e.target.value;
                    setVerificationCode(newCode.join(''));

                    // Move to the next input if a value is entered
                    if (e.target.value && i < 5) {
                      (e.target.nextElementSibling as HTMLInputElement)?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Move to the previous input on Backspace/Delete
                    if (e.key === 'Backspace' || e.key === 'Delete') {
                      const newCode = Array.from(verificationCode);
                      newCode[i] = '';
                      setVerificationCode(newCode.join(''));

                      if (i > 0) {
                        (e.target as HTMLInputElement).previousElementSibling;
                      }
                    }
                  }}
                  className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Secret Key */}
        {step === 3 && (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Enter Security Key</h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              For added security, please enter your clinic’s secret key.
            </p>
            <input
              placeholder="Secret Key"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="mb-6 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Clinic Details */}
        {step === 4 && (
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-center">Clinic Details</h2>
            <input
              placeholder="Clinic Name"
              type="text"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="mb-4 w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Clinic Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition duration-300"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
