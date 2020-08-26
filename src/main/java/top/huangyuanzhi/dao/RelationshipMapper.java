package top.huangyuanzhi.dao;

import java.util.List;
import org.apache.ibatis.annotations.Param;
import top.huangyuanzhi.model.vo.RelationshipExample;
import top.huangyuanzhi.model.vo.RelationshipKey;

public interface RelationshipMapper {
    long countByExample(RelationshipExample example);

    int deleteByExample(RelationshipExample example);

    int deleteByPrimaryKey(RelationshipKey key);

    int insert(RelationshipKey record);

    int insertSelective(RelationshipKey record);

    List<RelationshipKey> selectByExample(RelationshipExample example);

    int updateByExampleSelective(@Param("record") RelationshipKey record, @Param("example") RelationshipExample example);

    int updateByExample(@Param("record") RelationshipKey record, @Param("example") RelationshipExample example);
}