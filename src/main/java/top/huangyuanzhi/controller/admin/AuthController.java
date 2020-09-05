package top.huangyuanzhi.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import top.huangyuanzhi.constant.WebConst;
import top.huangyuanzhi.controller.home.AbstractController;
import top.huangyuanzhi.controller.util.MyUtils;
import top.huangyuanzhi.helper.ExceptionHelper;
import top.huangyuanzhi.model.bo.RestResponseBo;
import top.huangyuanzhi.model.vo.User;
import top.huangyuanzhi.service.IUserService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 * @Description 登录控制器
 * @Author Administrator
 * @Date 2020/09/03 下午 06:58
 * @Blog https:www.huangyuanzhi.top
 */
@Controller
@RequestMapping("/admin")
public class AuthController extends AbstractController {

    @Resource
    private IUserService userService;

    @GetMapping(value = "/login")
    public String login(){
        return "admin/login";
    }

    @PostMapping(value = "login")
    @ResponseBody
    public RestResponseBo dologin(@RequestParam String username,
                                  @RequestParam String password,
                                  HttpServletRequest request,
                                  HttpServletResponse response){
        Integer error_count = cache.get("login_error_count");

        try {
            User user = userService.login(username, password);
            request.getSession().setAttribute(WebConst.LOGIN_SESSION_KEY, user);
            // 设置12小时的cookie
            MyUtils.setCookie(response, user.getUid());
        } catch (Exception e) {
            error_count = null == error_count ? 1 : error_count + 1;
            if (error_count > 3) {
                return RestResponseBo.fail("您输入密码已经错误超过3次，请10分钟后尝试");
            }
            cache.set("login_error_count", error_count, 10 * 60);
            String msg = "登录失败";
            return ExceptionHelper.handlerException(msg, e);
        }
        return RestResponseBo.ok();
    }


}

