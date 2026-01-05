package org.example.skillandyou.service;

import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.ExchangeDTO;
import org.example.skillandyou.dto.SkillDTO;
import org.example.skillandyou.dto.UserSummaryDTO;
import org.example.skillandyou.entity.Exchange;
import org.example.skillandyou.repository.ExchangeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangeService {
    private final ExchangeRepository exchangeRepository;

    public List<ExchangeDTO> getAllExchanges() {
        return exchangeRepository.findAll().stream()
                .map(this::entityToDto)
                .toList();
    }

    public List<ExchangeDTO> getExchangesByRequester(Long userId) {
        return exchangeRepository.findByRequesterId(userId).stream()
                .map(this::entityToDto)
                .toList();
    }

    public List<ExchangeDTO> getExchangesByReceiver(Long userId) {
        return exchangeRepository.findByReceiverId(userId).stream()
                .map(this::entityToDto)
                .toList();
    }

    public ExchangeDTO createExchange(Exchange exchange) {
        Exchange saved = exchangeRepository.save(exchange);
        return entityToDto(saved);
    }

    private ExchangeDTO entityToDto(Exchange exchange) {
        UserSummaryDTO requester = new UserSummaryDTO(
                exchange.getRequester().getId(),
                exchange.getRequester().getUserName(),
                exchange.getRequester().getFirstName(),
                exchange.getRequester().getLastName(),
                exchange.getRequester().getEmail()
        );

        UserSummaryDTO receiver = new UserSummaryDTO(
                exchange.getReceiver().getId(),
                exchange.getReceiver().getUserName(),
                exchange.getReceiver().getFirstName(),
                exchange.getReceiver().getLastName(),
                exchange.getReceiver().getEmail()
        );

        SkillDTO offeredSkill = new SkillDTO(
                exchange.getOfferedSkill().getId(),
                exchange.getOfferedSkill().getName(),
                exchange.getOfferedSkill().getCategory(),
                exchange.getOfferedSkill().getDescription()
        );

        SkillDTO requestedSkill = new SkillDTO(
                exchange.getRequestedSkill().getId(),
                exchange.getRequestedSkill().getName(),
                exchange.getRequestedSkill().getCategory(),
                exchange.getRequestedSkill().getDescription()
        );

        return new ExchangeDTO(
                exchange.getId(),
                requester,
                receiver,
                offeredSkill,
                requestedSkill,
                exchange.getStatus().name(),
                exchange.getCreationDate(),
                exchange.getAcceptanceDate(),
                exchange.getCompletionDate()
        );
    }
}

