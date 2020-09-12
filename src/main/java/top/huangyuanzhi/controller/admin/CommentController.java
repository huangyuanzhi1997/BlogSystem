package top.huangyuanzhi.controller.admin;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import top.huangyuanzhi.controller.home.AbstractController;

/**
 * <p>
 *  前端控制器
 * </p>
 * 评论管理
 * @author Huang
 * @since 2020-09-02
 */
@Controller
@RequestMapping("admin/comments")
public class CommentController extends AbstractController {

    @GetMapping(value = "")
    public String index(){
        return "admin/comment_list";
    }

}

