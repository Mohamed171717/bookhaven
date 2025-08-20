
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterestP } from "react-icons/fa";

const Footer = () => {

  const t = useTranslations("HomePage");

  return (
    <footer className="bg-[#3d3a37] text-gray-300 pt-12 pb-4 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 md:px-6">
        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">IBook</h3>
          <p className="text-gray-400 leading-relaxed">
            {t('com')} <br />
            {t('trade')}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">{t('link')}</h3>
          <ul className="space-y-2">
            <li><Link href={'/shop'} className="hover:text-white transition-colors">{t('shop')}</Link></li>
            <li><Link href={'/community'} className="hover:text-white transition-colors">{t('community')}</Link></li>
            <li><Link href={'/support'} className="hover:text-white transition-colors">{t('support')}</Link></li>
            <li><Link href={'/profile'} className="hover:text-white transition-colors">{t('profile')}</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">{t('cust')}</h3>
          <ul className="space-y-2">
            <li><span>{t('store')}</span></li>
            <li><span>{t('work')}</span></li>
            <li><span>{t('pay')}</span></li>
            <li><span>{t('sup')}</span></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-3 text-base">{t('contact')}</h3>
          <div className="flex gap-3 mt-2">
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaTwitter />
            </a>
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaInstagram />
            </a>
            <a href="#" className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full text-white transition-colors">
              <FaPinterestP />
            </a>
          </div>
        </div>
      </div>

      <hr className="border-gray-600 my-3" />

      <div className="text-center text-gray-400 text-xs px-4 md:px-6">
        {t('rights')}
      </div>
    </footer>
  );
};

export default Footer;


export const SmallFooter = () => {
  const t = useTranslations("HomePage");
  return (
    <footer className="bg-[#3d3a37] text-gray-300 py-2 text-sm">
      <div className="text-center text-gray-400 my-[7px] text-xs px-4 md:px-6">
        {t('rights')}
      </div>
    </footer>
  );
};