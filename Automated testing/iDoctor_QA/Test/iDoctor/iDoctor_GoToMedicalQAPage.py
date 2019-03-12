from ATFPackage.ATF import ATF
from Config import Config
from iDoctor.iDctor_Backendlogin import iDoctor_Login

class iDoctor_GoToMedicalMainPage(iDoctor_Login):
    def GoToMedicalMainPage(self):

    # GO to MedicalQA Main Page
        #iDoctor_Login.Login(self)
        self.ClickElement('iDoctorBackendButton')
        self.ClickElement('MedicalMenuButton')
        self.ClickElement('MedicalQAMenuButton')
        self.AssertExist('MedicalQAMainPageTitle', "全部医讯问答列表")

