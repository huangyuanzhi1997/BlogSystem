package top.huangyuanzhi.service;

import top.huangyuanzhi.model.vo.User;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author Huang
 * @since 2020-09-02
 */
public interface IUserService {

    /**
     * 用户登录
     * @param username
     * @param password
     * @return
     */
    User login(String username,String password);

}
