package top.huangyuanzhi.controller.admin;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;

import javax.servlet.http.HttpServletRequest;

/**
 * <p>
 *  前端控制器
 * </p>
 * 文件管理
 * @author Huang
 * @since 2020-09-02
 */
@Controller
@RequestMapping("admin/attach")
public class AttachController extends AbstractController {

    @GetMapping(value = "")
    public String index(HttpServletRequest request){
        return "admin/attach";
    }
}

