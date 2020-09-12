package top.huangyuanzhi.controller.admin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;

import javax.servlet.http.HttpServletRequest;

/**
 * @Description 文章管理，包括发布文章
 * @Author Administrator
 * @Date 2020/09/11 20:28
 * @Blog https:www.huangyuanzhi.top
 */
@Controller
@RequestMapping("admin/article")
public class ArticleController extends AbstractController {

    @GetMapping(value = "")
    public String index(HttpServletRequest request){
        return "admin/article_list";
    }

    /**
     * 发表文章页面
     * @param request
     * @return
     */
    @GetMapping(value = "/publish")
    public String newArticle(HttpServletRequest request){
        return "admin/article_edit";
    }
}
