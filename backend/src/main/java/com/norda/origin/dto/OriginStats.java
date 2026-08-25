package com.norda.origin.dto;

import java.util.List;

public record OriginStats(
        int altitudeMinM,
        int altitudeMaxM,
        List<String> commonProcesses,
        double avgAcidity,
        double avgBody,
        double avgSweetness,
        List<String> topRegions
) {
}
