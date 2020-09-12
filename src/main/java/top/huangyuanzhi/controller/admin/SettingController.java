package top.huangyuanzhi.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description 系统设置
 * @Author Administrator
 * @Date 2020/09/11 20:24
 * @Blog https:www.huangyuanzhi.top
 */
@Controller
@RequestMapping("admin/setting")
public class SettingController extends AbstractController {

    @GetMapping(value = "")
    public String index(HttpServletRequest request){
        return "admin/setting";
    }
}
