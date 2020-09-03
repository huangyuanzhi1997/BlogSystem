package top.huangyuanzhi.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;


/**
 * @Description 登录控制器
 * @Author Administrator
 * @Date 2020/09/03 下午 06:58
 * @Blog https:www.huangyuanzhi.top
 */
@Controller
@RequestMapping("/admin")
public class AuthController extends AbstractController {

    @GetMapping(value = "/login")
    public String login(){
        return "admin/login";
    }
}
