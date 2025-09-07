import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} DigiPay — All rights reserved.
        </p>
        <div className="flex gap-4 text-sm">
          <Link className="hover:text-pink-600" to="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-pink-600" to="/terms">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
