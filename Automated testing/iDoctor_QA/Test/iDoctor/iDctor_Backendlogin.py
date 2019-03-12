from ATFPackage.ATF import ATF
from Config import Config


class iDoctor_Login(ATF):

    def __init__(self, browser):
        ATF.__init__(self, Browser=browser, Filename="Locator.xlsx", Sheet_name="Sheet1")

    def Login(self):
         # Login iDoctor Backend
        self.SendKeys('UserNameInput', 'QATesting')
        self.SendKeys('PwdInput', 'China@114')
        self.ClickElement('LoginButton')
        self.AssertExist('CheckLoginOK', "选择微信号")



