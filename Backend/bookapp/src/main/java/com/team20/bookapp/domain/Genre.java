package com.team20.bookapp.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gid; // PK, Auto Increment

    @Column(name = "main_tag", nullable = false)
    private String mainTag;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "genre_sub_tags", joinColumns = @JoinColumn(name = "genre_id"))
    @Column(name = "sub_tag_name", nullable = false)
    private List<String> subTag = new ArrayList<>();
}
