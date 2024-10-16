package com.zd.back.imgboard.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.zd.back.imgboard.model.ImgPost;

@Mapper
public interface ImgPostMapper {

     int maxImgPostId() throws Exception ; 

     void insertData(ImgPost dto) throws Exception;
   
     List<ImgPost> getLists() throws Exception;
}