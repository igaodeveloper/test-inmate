import { Sparkles, Twitter, Facebook, Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CardEx</span>
            </div>
            <p className="text-gray-400 mb-4">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.browseCards')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.activeTrades')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.myCollection')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.tradeHistory')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.tradingGuidelines')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.safetyTips')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.contactUs')}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CardEx. {t('footer.rightsReserved')} Built with ❤️ for collectors.
          </p>
        </div>
      </div>
    </footer>
  );
}
