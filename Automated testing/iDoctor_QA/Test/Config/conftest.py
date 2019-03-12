import pytest
from selenium import webdriver
from Config import Config
from airtest.core.api import *
from airtest.__main__ import main as main_parser
from ATFPackage.ATF import ATF,AIR

@pytest.fixture(scope="session")
def chromeBrowser():
    chromeoptions = webdriver.ChromeOptions()
    chromeoptions.add_argument(Config.ChromeUsesrAgent)
    browser = webdriver.Chrome(chrome_options=chromeoptions)
    setupatf=ATF(Browser=browser, Filename="Locator.xlsx", Sheet_name="Sheet1")
    # setupatf=ATF(Browser=browser)
    setupatf.GoToUrl(Config.iDoctorBackendURL)
    setupatf.MaxWindows()
    setupatf.ReadConst()
    yield browser
    # browser.close()

@pytest.fixture(scope="session")
def androidAIR():
    AIR().Connect_Device("android:///")
    AIR().Stop_App("com.tencent.mm")
    AIR().Wake()
    AIR().Start_App("com.tencent.mm")
    time.sleep(3)
    yield
    AIR().Stop_App("com.tencent.mm")

def RunAir(AirScript,log=True):
    filepath=Config.AirScriptsPath
    if log==True:
        argv = ["run",  filepath+AirScript, "--device", "Android:///"+Config.AndroidDevice,"--log"]
    else:
        argv = ["run",  filepath+AirScript, "--device", "Android:///"+Config.AndroidDevice]        
    main_parser(argv)
