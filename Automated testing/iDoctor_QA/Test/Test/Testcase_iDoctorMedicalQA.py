from iDoctor.iDctor_Backendlogin import iDoctor_Login
from iDoctor.iDoctor_GoToMedicalQAPage import iDoctor_GoToMedicalMainPage
from iDoctor.iDoctor_GoToSessionAndReply import iDoctor_GoToSessionAndReply
from Config.conftest import chromeBrowser
import pytest


class TestiDoctor_Login():
#login   part
    def test_iDoctorLogin(self, chromeBrowser):
        iDoctor_Login(chromeBrowser).Login()

#mainpage  part
    def test_iDoctorGotoMedicalQAMainPage(self, chromeBrowser):
        iDoctor_GoToMedicalMainPage(chromeBrowser).GoToMedicalMainPage()

#GoToSessionAndReply   part
    def test_iDoctorGoToSessionAndReply(self,  chromeBrowser):
        iDoctor_GoToSessionAndReply(chromeBrowser).GoToSessionAndReply()


if __name__ == '__main__':
    pytest.main(['Testcase_iDoctorMedicalQA.py'])