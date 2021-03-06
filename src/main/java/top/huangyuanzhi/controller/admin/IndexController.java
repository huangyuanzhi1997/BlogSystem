package top.huangyuanzhi.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;
import top.huangyuanzhi.service.IUserService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

/**
 * @Description 博客系统后台管理首页管理页面控制器
 * @Author Administrator
 * @Date 2020/9/3 上午 01:17
 * @Blog https:www.huangyuanzhi.top
 */
@Controller("adminIndexController")
@RequestMapping("/admin")
public class IndexController extends AbstractController {

    @Resource
    private IUserService userService;


    @GetMapping(value = {"","/index"})
    public String index(HttpServletRequest request){
        return "admin/index";
    }
}
