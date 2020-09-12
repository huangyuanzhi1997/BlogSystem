package top.huangyuanzhi.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description 分类/标签管理
 * @Author Administrator
 * @Date 2020/09/11 20:15
 * @Blog https:www.huangyuanzhi.top
 */
@Controller
@RequestMapping("admin/category")
public class CategoryController extends AbstractController {

    @GetMapping(value = "")
    public String index(HttpServletRequest request){
        return "admin/category";
    }
}
