/**
 * Register Page
 */

import { RegisterForm } from "../features/auth/components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
