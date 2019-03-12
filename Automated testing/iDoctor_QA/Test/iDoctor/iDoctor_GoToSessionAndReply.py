from ATFPackage.ATF import ATF
from Config import Config
from iDoctor.iDoctor_GoToMedicalQAPage import iDoctor_GoToMedicalMainPage
import time


class iDoctor_GoToSessionAndReply(iDoctor_GoToMedicalMainPage):

    def GoToSessionAndReply(self):

        # content = self.ReadConst('ATitleOfDialogList')
        # print(content)
# Part1   进入会话，并进行验证
        self.AssertExist('ATitleOfDialogList', '陈妍希')  # 验证是否存在该条对话记录，之后与之校验是否匹配
        self.ClickElement('MedicalQAchecklistButton')     #查看会话

# part2    接受会话，并验证是否与前文的title匹配
        self.AssertExist('DialogTitle', '陈妍希')
        time.sleep(3)
        self.ClickElement('MedicalQAGetButton')     #接受会话

# part3     进行对话回复
        self.ClickElement('Messagebox')
        self.SendKeys('Messagebox', '这是一大堆回复的内容xiba~0.0!@#$%^&*()_++:"?><,.||')
        self.ClickElement('SubmitBtn')
        # 验证消息框内容是否发送出去，即对话框中是否存在相同内容
        self.AssertExist('DialogBox', '这是一大堆回复的内容xiba~0.0!@#$%^&*()_++:"?><,.||')
        time.sleep(2)   #作延迟看下结果
