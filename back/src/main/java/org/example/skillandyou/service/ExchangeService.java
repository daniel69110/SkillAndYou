package org.example.skillandyou.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.skillandyou.dto.CreateExchangeRequestDTO;
import org.example.skillandyou.dto.ExchangeDTO;
import org.example.skillandyou.dto.SkillDTO;
import org.example.skillandyou.dto.UserSummaryDTO;
import org.example.skillandyou.entity.Exchange;
import org.example.skillandyou.entity.Skill;
import org.example.skillandyou.entity.User;
import org.example.skillandyou.entity.enums.ExchangeStatus;
import org.example.skillandyou.repository.ExchangeRepository;
import org.example.skillandyou.repository.SkillRepository;
import org.example.skillandyou.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExchangeService {
    private final ExchangeRepository exchangeRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public List<ExchangeDTO> getAllExchanges() {
        return exchangeRepository.findAll().stream()
                .map(this::entityToDto)
                .toList();
    }

    public List<ExchangeDTO> getMyExchanges(Long userId) {
        return exchangeRepository.findMyExchanges(userId)
                .stream().map(this::entityToDto).toList();
    }

    public List<ExchangeDTO> getExchangesByRequester(Long userId) {
        return exchangeRepository.findByRequester_Id(userId).stream()
                .map(this::entityToDto)
                .toList();
    }

    public List<ExchangeDTO> getExchangesByReceiver(Long userId) {
        return exchangeRepository.findByReceiver_Id(userId).stream()
                .map(this::entityToDto)
                .toList();
    }

    public ExchangeDTO createExchange(CreateExchangeRequestDTO request) {

        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new EntityNotFoundException("Requester not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new EntityNotFoundException("Receiver not found"));
        Skill offeredSkill = skillRepository.findById(request.getOfferedSkillId())
                .orElseThrow(() -> new EntityNotFoundException("Offered skill not found"));
        Skill requestedSkill = skillRepository.findById(request.getRequestedSkillId())
                .orElseThrow(() -> new EntityNotFoundException("Requested skill not found"));

        Exchange exchange = new Exchange();
        exchange.setRequester(requester);
        exchange.setReceiver(receiver);
        exchange.setOfferedSkill(offeredSkill);
        exchange.setRequestedSkill(requestedSkill);
        exchange.setStatus(ExchangeStatus.PENDING);
        exchange.setCreationDate(LocalDateTime.now());

        Exchange saved = exchangeRepository.save(exchange);
        return entityToDto(saved);
    }

    public ExchangeDTO acceptExchange(Long exchangeId, Long receiverId) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new EntityNotFoundException("Exchange not found"));

        if (!exchange.getReceiver().getId().equals(receiverId)) {
            throw new IllegalStateException("Seul le receiver peut accepter");
        }
        if (exchange.getStatus() != ExchangeStatus.PENDING) {
            throw new IllegalStateException("Seul PENDING peut être accepté");
        }

        exchange.setStatus(ExchangeStatus.ACCEPTED);
        exchange.setAcceptanceDate(LocalDateTime.now());
        return entityToDto(exchangeRepository.save(exchange));
    }

    public ExchangeDTO completeExchange(Long exchangeId) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new EntityNotFoundException("Exchange not found"));

        if (exchange.getStatus() != ExchangeStatus.ACCEPTED) {
            throw new IllegalStateException("Seul ACCEPTED peut être complété");
        }

        exchange.setStatus(ExchangeStatus.COMPLETED);
        exchange.setCompletionDate(LocalDateTime.now());
        return entityToDto(exchangeRepository.save(exchange));
    }

    public ExchangeDTO cancelExchange(Long exchangeId) {
        Exchange exchange = exchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new EntityNotFoundException("Exchange not found"));

        if (exchange.getStatus() == ExchangeStatus.COMPLETED) {
            throw new IllegalStateException("COMPLETED ne peut être annulé");
        }

        exchange.setStatus(ExchangeStatus.CANCELLED);
        return entityToDto(exchangeRepository.save(exchange));
    }

    public ExchangeDTO getExchangeById(Long id) {
        Exchange exchange = exchangeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exchange not found: " + id));
        return entityToDto(exchange);
    }

    private ExchangeDTO entityToDto(Exchange exchange) {
        // Ton mapper existant (sans email)
        return new ExchangeDTO(
                exchange.getId(),
                new UserSummaryDTO(exchange.getRequester().getId(), exchange.getRequester().getUserName(),
                        exchange.getRequester().getFirstName(), exchange.getRequester().getLastName()),
                new UserSummaryDTO(exchange.getReceiver().getId(), exchange.getReceiver().getUserName(),
                        exchange.getReceiver().getFirstName(), exchange.getReceiver().getLastName()),
                new SkillDTO(exchange.getOfferedSkill().getId(), exchange.getOfferedSkill().getName(),
                        exchange.getOfferedSkill().getCategory(), exchange.getOfferedSkill().getDescription()),
                new SkillDTO(exchange.getRequestedSkill().getId(), exchange.getRequestedSkill().getName(),
                        exchange.getRequestedSkill().getCategory(), exchange.getRequestedSkill().getDescription()),
                exchange.getStatus().name(),
                exchange.getCreationDate(),
                exchange.getAcceptanceDate(),
                exchange.getCompletionDate()
        );
    }
}

