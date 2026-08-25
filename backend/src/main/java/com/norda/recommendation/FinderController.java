package com.norda.recommendation;

import com.norda.recommendation.dto.FinderRequest;
import com.norda.recommendation.dto.FinderResultItem;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class FinderController {

    private final RecommendationEngine recommendationEngine;

    public FinderController(RecommendationEngine recommendationEngine) {
        this.recommendationEngine = recommendationEngine;
    }

    @PostMapping("/finder")
    public List<FinderResultItem> finder(@Valid @RequestBody FinderRequest request) {
        return recommendationEngine.recommend(request);
    }
}
